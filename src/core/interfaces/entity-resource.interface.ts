export interface IResource<TEntityResponse, TEntityDetailResponse> {
  responseDto(): Promise<TEntityResponse>
  detailResponseDto(): Promise<TEntityDetailResponse>
}
