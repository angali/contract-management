interface IErrorResponse{
    status?: number;
    data: { error: string}
}

export interface IAPIError {
    response : IErrorResponse;
}