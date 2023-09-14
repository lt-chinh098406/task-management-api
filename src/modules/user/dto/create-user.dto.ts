import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @Matches(/^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/, {
    message: 'Email is not valid',
  })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^((?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,})$/,
    {
      message: 'Password is too weak',
    },
  )
  password: string;
}
