export interface FetchUserLikedTracks {
    id: number,
    owner_id: number,
    is_public: boolean,
    meta: {
        title: string,
        artists: string[],
        duration: number,
        cover_url: string,
    },
    likes: Record<string, never>;
}