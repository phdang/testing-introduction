import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Sse } from '@nestjs/common'
import { AppService } from './app.service'
import { NotificationService } from './notifications/notification.service'
import { Currency, Prisma } from '@prisma/client'
import { SettingService } from './settings/setting.service'
import { SETTING_KEYS } from './contants/setting-key.contant'
import { PrismaService } from './prisma/prisma.service'
import { NftStatus } from '@prisma/client'
import { NftService } from './nfts/nft.service'
import { TestTransferNftDto } from './test.dto'
import { RedisService } from './redis/redis.service'
import { ConfigurationService } from './config/configuration.service'
import { MailerService } from './mail/mail.service'
import { PVINE_REPRESENTATIVE_USER_ID } from './users/user.constant'

const config = ConfigurationService.getConfig()
const nodeEnv = config.get('nodeEnv')
const nodeEnvs = config.get('nodeEnvs')

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
    private readonly settingService: SettingService,
    private readonly prisma: PrismaService,
    private readonly nftService: NftService,
    private readonly redisService: RedisService,
    private readonly mailService: MailerService
  ) {}

  @Get()
  async getHello() {
    return 'hello'
  }

  @Get('clear-caches/:group')
  async clearCaches(@Param('group') group: string) {
    if (nodeEnv !== nodeEnvs.production) {
      await this.redisService.clearGroup(group)
    }
    return true
  }

  @Get('currency')
  async getCurrency() {
    return { currency: Object.values(Currency) }
  }

  @Get('primary-sale-shipping-currency')
  async getPrimaryShippingCurrency() {
    const shippingCurrency: Currency =
      (await this.settingService.findByKey(SETTING_KEYS.admin_currency))?.value[
        SETTING_KEYS.admin_currency
      ] || Currency.JPY
    return { currency: shippingCurrency }
  }

  @Get('test/scan-to-own')
  async testScanToOwn() {
    return this.prisma.nft.updateMany({
      where: {
        rand: {
          physicalDisc: {
            in: ['A0001', 'A0002', 'A0003', 'A0004', 'A0005']
          }
        }
      },
      data: {
        status: NftStatus.notActivated
      }
    })
  }

  @Post('test/transfer-nft')
  async testTransferNft(@Body() { nftId, newOwnerId }: TestTransferNftDto) {
    const newOwner = await this.prisma.user.findUnique({
      where: {
        userId: newOwnerId
      }
    })
    const data: Prisma.NftUncheckedUpdateInput = {
      ownerId: newOwner.id,
      currentSaleV2Id: null
    }
    if (newOwnerId === PVINE_REPRESENTATIVE_USER_ID) {
      data.status = NftStatus.lazyMint
      data.ownedAt = new Date()
    } else {
      const newOwnerCard = await this.prisma.ownerCard.create({
        data: {
          nftId: nftId,
          userId: newOwner.id,
          country: newOwner.country
        }
      })
      data.currentOwnerCardId = newOwnerCard.id
      data.status = NftStatus.pending
    }

    return await this.prisma.nft.update({
      where: {
        id: nftId
      },
      data: data
    })
  }

  @Get('test/lock-phygital/:nftId')
  async testLockPhygital(@Param('nftId', new ParseUUIDPipe()) nftId: string) {
    return this.prisma.nft.update({
      where: {
        id: nftId
      },
      data: {
        status: NftStatus.notActivated
      }
    })
  }

  @Sse('user-events/:userId')
  getUserEvents(@Param('userId') userId: number) {
    return this.notificationService.sseParam(userId)
  }
}
