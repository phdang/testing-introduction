import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CollectionModule } from './collections/collection.module'
import { ConfigurationModule } from './config/configuration.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { S3UploadService } from './upload/s3-upload.service'
import { SchemaModule } from './schemas/schema.module'
import { UserModule } from './users/user.module'
import { NftModule } from './nfts/nft.module'
import { MailerService } from './mail/mail.service'
import { BaseModule } from './base/base.module'
import { LoggerModule } from './logger/logger.module'
import { LogErrorsModule } from './log-errors/log-errors.module'
import { UploadModule } from './uploads/upload.module'
import { UserLikedModule } from './user-liked/user-liked.module'
import { ChainVerificationModule } from './chain-verification/chain-verification.module'
import { SettingModule } from './settings/setting.module'
import { StripeModule } from './stripe/stripe.module'
import { ExchangeModule } from './exchange/exchange.module'
import { EosModule } from './eos/eos.module'
import { BullModule } from '@nestjs/bull'
import { TConfiguration } from './config/configuration'
import { ConfigurationService } from './config/configuration.service'
import { HttpClientModule } from './http-clients/http-client.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { FormatModule } from './formats/format.module'
import { StyleModule } from './styles/style.module'
import { LogSystemModule } from './log-systems/log-systems.module'
import { FollowModule } from './follows/follow.module'
import { NotificationModule } from './notifications/notification.module'
import { TotalModule } from './totals/total.module'
import { ShippingPolicyModule } from './shipping-policies/shipping-policy.module'
import { AssetModule } from './assets/asset.module'
import { QueueModule } from './queues/queue.module'
import { GenreModule } from './genres/genre.module'
import { ReleaseModule } from './releases/release.module'
import { GoogleStorageService } from './upload/google-storage.service'
import { LabelModule } from './labels/label.module'
import { ArtistModule } from './artists/artist.module'
import { TrackModule } from './tracks/track.module'
import { CountryModule } from './countries/country.module'
import { ShippingCountryModule } from './shipping-countries/shipping-country.module'
import { ShippingAddressModule } from './shipping-addresses/shipping-address.module'
import { ShippingPolicySetModule } from './shipping-policy-sets/shipping-policy-set.module'
import { OtherModule } from './others/other.module'
import { WantModule } from './wants/want.module'
import { OrderV2Module } from './ordersV2/orderV2.module'
import { TemplateV2Module } from './templatesV2/templateV2.module'
import { StatisticSaleV2Module } from './statistic-salesV2/statistic-saleV2.module'
import { TransactionModule } from './transactions/transaction.module'
import { StoRequestModule } from './sto-requests/sto-request.module'
import { AirdropModule } from './airdrops/airdrop.module'
import { RedisService } from './redis/redis.service'
import { MediaModule } from './media/media.module'
import { NfcTagModule } from './nfc-tags/nfc-tag.module'
import { CartModule } from './cart/cart.module'

const DEFAULT_THROTTLE_TTL = Number(process.env?.THROTTLE_TTL || 60)
const DEFAULT_THROTTLE_LIMIT = Number(process.env?.THROTTLE_LIMIT || 100)
const config = ConfigurationService.getConfig()
const REDIS: TConfiguration['redis'] = config.get('redis')
const nodeEnv: TConfiguration['nodeEnv'] = config.get('nodeEnv')
const environments: TConfiguration['nodeEnvs'] = config.get('nodeEnvs')
const importModules = [
  ScheduleModule.forRoot(),
  ThrottlerModule.forRoot({
    ttl: DEFAULT_THROTTLE_TTL,
    limit: DEFAULT_THROTTLE_LIMIT
  }),
  BullModule.forRoot({
    redis: REDIS
  }),
  BaseModule,
  UserModule,
  PrismaModule,
  HttpClientModule,
  ConfigurationModule,
  AuthModule,
  RedisModule,
  CollectionModule,
  SchemaModule,
  NftModule,
  LoggerModule,
  LogErrorsModule,
  ShippingAddressModule,
  UploadModule,
  UserLikedModule,
  ChainVerificationModule,
  SettingModule,
  StripeModule,
  ExchangeModule,
  EosModule,
  FormatModule,
  StyleModule,
  ReleaseModule,
  LabelModule,
  ArtistModule,
  CountryModule,
  GenreModule,
  TrackModule,
  DashboardModule,
  FollowModule,
  NotificationModule,
  TotalModule,
  ShippingCountryModule,
  ShippingPolicyModule,
  ShippingPolicySetModule,
  QueueModule,
  AssetModule,
  OtherModule,
  WantModule,
  OrderV2Module,
  TemplateV2Module,
  StatisticSaleV2Module,
  TransactionModule,
  StoRequestModule,
  AirdropModule,
  MediaModule,
  NfcTagModule,
  CartModule
]

if (nodeEnv === environments.development) {
  importModules.push(LogSystemModule)
}
@Module({
  imports: importModules,
  controllers: [AppController],
  providers: [
    ConfigService,
    S3UploadService,
    RedisService,
    GoogleStorageService,
    MailerService,
    AppService
  ]
})
export class AppModule {}
