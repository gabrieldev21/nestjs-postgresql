class ListFeatureProductDto {
  name: string;
  description: string;
}

class ListImageProductDto {
  url: string;
  description: string;
}

export class ListProductDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly features: ListFeatureProductDto[],
    readonly images: ListImageProductDto[]
  ) {}
}
