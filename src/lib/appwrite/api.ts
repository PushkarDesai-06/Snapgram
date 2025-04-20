import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionID,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (e) {
    console.log(e);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    // await account.deleteSession('current');

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    console.log(e);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function createPost(post: INewPost) {
  try {
    // Uploaded image to appwrite Storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    // Get the file URL
    let fileUrl;
    try {
      fileUrl = await getFilePreview(uploadedFile.$id);
      console.log("File URL length:", fileUrl.toString().length);
    } catch (error) {
      deleteFile(uploadedFile.$id);
      throw new Error("Failed to generate file preview");
    }

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags to array
    const tags = post.tags?.replace(/ /g, "").split(",");

    try {
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl.toString(),
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );

      return newPost;
    } catch (error) {
      await deleteFile(uploadedFile.$id);
      console.error("Error creating post:", error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    // Add width parameter to reduce the image size and URL length
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      800, // Set a reasonable width
      800, // Set a reasonable height
      "top", // Crop position
      100 // Quality
    );

    if (!fileUrl) {
      deleteFile(fileId);
      throw Error;
    }

    // // Check if URL length is within Appwrite's limits
    // if (fileUrl.toString().length > 2000) {
    //   console.warn("Generated URL is too long, trying with smaller dimensions");
    //   // Try again with smaller dimensions if still too large
    //   const smallerFileUrl = storage.getFilePreview(
    //     appwriteConfig.storageId,
    //     fileId,
    //     400, // Smaller width
    //     400, // Smaller height
    //     "top", // Crop position
    //     80 // Lower quality
    //   );
    //   return smallerFileUrl;
    // }

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate file preview");
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionID,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;
  return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    // For relationship fields, Appwrite expects an array of string IDs
    // or an array of document objects with $id property
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionID,
      postId,
      {
        // Format likes as an array of objects with $id for relationship fields
        likes: likesArray.map((userId) => userId),
      }
    );

    if (!updatedPost) {
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log("Error in likePost:", error);
    throw error; // Re-throw to handle in UI
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    // Ensure we're using the correct format for relationships
    // For Appwrite relationships, you need to use the exact document ID string
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionID,
      ID.unique(),
      {
        user: userId, // This should be the user document ID string
        post: postId, // This should be the post document ID string
      }
    );

    if (!updatedPost) {
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to handle in the UI
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionID,
      savedRecordId
    );

    if (!statusCode) {
      throw Error;
    }

    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionID,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      let fileUrl;
      fileUrl = await getFilePreview(uploadedFile.$id);
      console.log("File URL length:", fileUrl.toString().length);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",");

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionID,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionID,
      postId
    );

    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}
