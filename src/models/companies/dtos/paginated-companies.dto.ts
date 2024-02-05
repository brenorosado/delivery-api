import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';
import { CompanyDto } from './company.dto';
import { Paginated } from 'src/utils/pagination.util';

export class PaginatedCompaniesDto {
  constructor(partial: Partial<Paginated>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => CompanyDto)
  content: any[];

  @Expose()
  page: number;

  @Expose()
  totalElements: number;

  @Expose()
  totalPages: number;
}
