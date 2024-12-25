import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NotificationService } from './notifications/notification.service'
import { PrismaService } from './prisma/prisma.service'
import { RedisService } from './redis/redis.service'
import { NftService } from './nfts/nft.service'

import { MailerService } from './mail/mail.service'

import { ReleaseModule } from './releases/release.module'
import { NftModule } from './nfts/nft.module'
import { AppModule } from './app.module'
import { UserModule } from './users/user.module'
import { NotificationModule } from './notifications/notification.module'
import { LabelModule } from './labels/label.module'
import { UploadModule } from './uploads/upload.module'
import { OwnerCardModule } from './owner-cards/owner-card.module'
import { SaleV2Module } from './salesV2/saleV2.module'
import { WantModule } from './wants/want.module'
import { NftHistoryModule } from './nft-histories/nft-history.module'
import { TemplateV2Module } from './templatesV2/templateV2.module'
import { TotalModule } from './totals/total.module'
import { ArtistModule } from './artists/artist.module'
import { HttpClientModule } from './http-clients/http-client.module'
import { QueueModule } from './queues/queue.module'
import { UserLikedModule } from './user-liked/user-liked.module'
import { SettingModule } from './settings/setting.module'
import { StoRequestModule } from './sto-requests/sto-request.module'
import { NfcTagModule } from './nfc-tags/nfc-tag.module'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
       AppModule,
       ReleaseModule,
       ArtistModule,
       HttpClientModule,
       QueueModule,
       UserModule,
       NftModule,
       TotalModule,
       NotificationModule,
       LabelModule,
       UploadModule,
       OwnerCardModule,
       SaleV2Module,
       WantModule,
       NftHistoryModule,
       TemplateV2Module,
       SettingModule,
       UserLikedModule,
       StoRequestModule,
       NfcTagModule
      ],
      controllers: [AppController],
      providers: [
       AppService,
       NotificationService,
       PrismaService, NftService, RedisService, MailerService
      ]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined()
    })
    it('should return "hello"', async () => {
      const response = await appController.getHello()
      expect(response).toBe('hello')
    })
  })
})
