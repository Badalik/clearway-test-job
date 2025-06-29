export interface DocumentResponse {
  name: string;
  pages: DocumentPageResponse[] | null;
}

export interface DocumentPageResponse {
  number: number;
  imageUrl: string;
}
