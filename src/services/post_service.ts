import apiClient, { CanceledError } from "./api_client";

export { CanceledError };

export interface Comment {
    content: string;
    owner: string;
    email: string;
}

export interface Post {
    _id: string;
    title: string;
    content: string;
    owner: string;
    email: string;
    username: string;
    profileImage: string;
    image: string;
    comments?: Comment[];
}

const getAllPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>("/posts", { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

const generateBookDescription = async (bookTitle: string, details: string, tone: string) => {
    try {
        const response = await apiClient.post<{ description: string }>("/api/gemini/generate-description", {
            bookTitle,
            details,
            tone,
        });

        return response.data.description;
    } catch (error) {
        console.error("Error generating book description:", error);
        return "Failed to generate description.";
    }
};

export default { getAllPosts, generateBookDescription };
