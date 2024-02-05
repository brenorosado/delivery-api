import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';
import { Paginated } from 'src/utils/pagination.util';
import { UserDto } from './user.dto';

export class PaginatedUsersDto {
  constructor(partial: Partial<Paginated>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => UserDto)
  content: any[];

  @Expose()
  page: number;

  @Expose()
  totalElements: number;

  @Expose()
  totalPages: number;
}
