import apiClient, { CanceledError } from "./api_client"


export { CanceledError }

export interface Post {
    _id: string,
    title: string,
    content: string,
    owner: string,
    image: string,
    comments?: string[]; 
}

const getAllPosts = () => {
    const abortController = new AbortController()
    const request = apiClient.get<Post[]>("/posts"
        , { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

export default { getAllPosts }