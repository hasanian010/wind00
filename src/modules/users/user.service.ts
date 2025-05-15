import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        provider: true,
        isVerified: true,
        isBanned: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user || !user.isVerified) {
      throw new NotFoundException('User not found or not verified');
    }
    return user;
  }

  async getUsers(searchInput: { search?: string; orderBy?: string; limit?: number; page?: number }) {
    const where = {
      isVerified: true,
      role: 'user',
      ...(searchInput.search && {
        name: {
          contains: searchInput.search,
          mode: 'insensitive',
        },
      }),
    };

    const orderBy = {
      createdAt: searchInput.orderBy?.toLowerCase() === 'asc' ? 'asc' : 'desc',
    };

    const page = searchInput.page ?? 1;
    const limit = searchInput.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      results: items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async signup(signupInput: any) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        phone: signupInput.phone,
        isVerified: true,
      },
    });
    if (existingUser) {
      throw new NotFoundException('User already registered!');
    }
    await this.prisma.user.deleteMany({
      where: {
        phone: signupInput.phone,
        isVerified: false,
      },
    });

    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    // TODO: Implement sentSms function or service
    // await sentSms(signupInput.phone, `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);

    const passwordHash = await bcrypt.hash(signupInput.password, 12);
    const newUser = await this.prisma.user.create({
      data: {
        ...signupInput,
        password: passwordHash,
        otp: secret.base32,
      },
    });

    return {
      success: true,
      message: 'Code sent to your phone successfully!',
    };
  }

  async getAdmins(searchInput: { search?: string; orderBy?: string; limit?: number; page?: number }) {
    const where = {
      isVerified: true,
      role: 'admin',
      ...(searchInput.search && {
        name: {
          contains: searchInput.search,
          mode: 'insensitive',
        },
      }),
    };

    const orderBy = {
      createdAt: searchInput.orderBy?.toLowerCase() === 'asc' ? 'asc' : 'desc',
    };

    const page = searchInput.page ?? 1;
    const limit = searchInput.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      results: items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async addAdmin(adminInput: any) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        phone: adminInput.phone,
        role: 'admin',
      },
    });
    if (existingUser) {
      throw new NotFoundException('Admin already exists!');
    }
    const passwordHash = await bcrypt.hash(adminInput.password, 12);
    const newAdmin = await this.prisma.user.create({
      data: {
        ...adminInput,
        password: passwordHash,
        role: 'admin',
        isVerified: true,
      },
    });
    return {
      success: true,
      message: 'Admin added successfully!',
    };
  }

  async resend(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone,
        isVerified: false,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found or already verified');
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: secret.base32 },
    });
    // TODO: Implement sentSms function or service
    // await sentSms(phone, `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
    return {
      success: true,
      message: 'Code resent to your phone successfully!',
    };
  }

  async phoneLogin(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone,
        isVerified: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found or not verified');
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: secret.base32 },
    });
    // TODO: Implement sentSms function or service
    // await sentSms(phone, `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
    return {
      success: true,
      message: 'Code sent to your phone successfully!',
    };
  }

  async verify(verifyPhoneInput: { phone: string; otp: string }, req: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: verifyPhoneInput.phone,
        otp: verifyPhoneInput.otp,
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid phone or OTP');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
      },
    });
    // Generate JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    return {
      success: true,
      message: 'Phone verified successfully!',
      token,
    };
  }

  async login(loginInput: { phoneOrEmail: string; password: string }, req: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: loginInput.phoneOrEmail },
          { email: loginInput.phoneOrEmail },
        ],
        isVerified: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found or not verified');
    }
    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }
    // Generate JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    return {
      success: true,
      message: 'Login successful!',
      token,
    };
  }

  async adminLogin(loginInput: { phoneOrEmail: string; password: string }, req: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: loginInput.phoneOrEmail },
          { email: loginInput.phoneOrEmail },
        ],
        isVerified: true,
        role: 'admin',
      },
    });
    if (!user) {
      throw new NotFoundException('Admin not found or not verified');
    }
    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }
    // Generate JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    return {
      success: true,
      message: 'Admin login successful!',
      token,
    };
  }

  async sellerLogin(loginInput: { phoneOrEmail: string; password: string }, req: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: loginInput.phoneOrEmail },
          { email: loginInput.phoneOrEmail },
        ],
        isVerified: true,
        role: 'seller',
      },
    });
    if (!user) {
      throw new NotFoundException('Seller not found or not verified');
    }
    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }
    // Generate JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    return {
      success: true,
      message: 'Seller login successful!',
      token,
    };
  }

  async update(updateUserInput: any, reqUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: reqUser.id },
      data: updateUserInput,
    });
    return updatedUser;
  }

  async changePassword(changePasswordInput: { oldPassword: string; newPassword: string }, reqUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isOldPasswordValid = await bcrypt.compare(changePasswordInput.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new NotFoundException('Old password is incorrect');
    }
    const newPasswordHash = await bcrypt.hash(changePasswordInput.newPassword, 12);
    await this.prisma.user.update({
      where: { id: reqUser.id },
      data: { password: newPasswordHash },
    });
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  async forgetPassword(forgetPasswordInput: { phone: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: forgetPasswordInput.phone,
        isVerified: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found or not verified');
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: secret.base32 },
    });
    // TODO: Implement sentSms function or service
    // await sentSms(forgetPasswordInput.phone, `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
    return {
      success: true,
      message: 'Code sent to your phone successfully!',
    };
  }

  async resetPassword(resetPasswordInput: { phone: string; code: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: resetPasswordInput.phone,
        otp: resetPasswordInput.code,
        isVerified: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid phone or code');
    }
    const passwordHash = await bcrypt.hash(resetPasswordInput.password, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash, otp: null },
    });
    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  async available(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        phone,
        isVerified: true,
      },
    });
    return { available: !user };
  }

  async phoneChange(phoneChangeInput: { phone: string }, reqUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.prisma.user.update({
      where: { id: reqUser.id },
      data: {
        newPhone: phoneChangeInput.phone,
        otp: secret.base32,
      },
    });
    // TODO: Implement sentSms function or service
    // await sentSms(phoneChangeInput.phone, `${otp} is your security code for phone change. Do not share security code with others. This code will be expired in 5 minutes.`);
    return {
      success: true,
      message: 'Code sent to your new phone successfully!',
    };
  }

  async changePhoneVerify(changePhoneVerifyInput: { phone: string; code: string }, reqUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.otp !== changePhoneVerifyInput.code || user.newPhone !== changePhoneVerifyInput.phone) {
      throw new NotFoundException('Invalid phone or code');
    }
    await this.prisma.user.update({
      where: { id: reqUser.id },
      data: {
        phone: changePhoneVerifyInput.phone,
        newPhone: null,
        otp: null,
      },
    });
    return {
      success: true,
      message: 'Phone number changed successfully',
    };
  }
}
