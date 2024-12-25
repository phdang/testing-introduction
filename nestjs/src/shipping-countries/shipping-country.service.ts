import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import {
  findShippingCountrySelect,
  TShippingCountry,
  TShippingCountryCreate,
  TShippingCountrySelect,
  TShippingCountryUpdate
} from './shipping-country.type'
import { TCode } from 'src/utils/code.util'
import { SHIPPING_COUNTRY_ERROR_CODES } from './shipping-country.code'
import { RedisService } from 'src/redis/redis.service'
import { TConfiguration } from 'src/config/configuration'
import { ConfigurationService } from 'src/config/configuration.service'
import { CACHES } from 'src/redis/redis.key'

const config = ConfigurationService.getConfig()
const redis: TConfiguration['redis'] = config.get('redis')

@Injectable()
export class ShippingCountryService {
  constructor(private prisma: PrismaService, private redisService: RedisService) {}

  async ifShippingCountryNameNotExist(
    name: string,
    shippingCountryId?: number
  ): Promise<[boolean, TCode]> {
    const key = `${CACHES.shippingCountry.group}:${CACHES.shippingCountry.getShippingCountriesService}:${name}`
    const cache = await this.redisService.getKey(key)
    this.redisService.addGroup(key, CACHES.shippingCountry.group)
    let foundRecord: TShippingCountry | null = null
    if (cache) {
      foundRecord = cache
    } else {
      foundRecord = await this.prisma.shippingCountry.findUnique({
        where: {
          name
        }
      })
      await this.redisService.setKey(key, JSON.stringify(foundRecord), redis.ttl)
    }
    if (foundRecord && foundRecord.id !== shippingCountryId)
      return [false, SHIPPING_COUNTRY_ERROR_CODES.ERROR_SHIPPING_COUNTRY_002]
    return [true, null]
  }

  ifShippingCountryActive(shippingCountry: TShippingCountry): [boolean, TCode] {
    if (shippingCountry.deletedAt)
      return [false, SHIPPING_COUNTRY_ERROR_CODES.ERROR_SHIPPING_COUNTRY_003]
    return [true, null]
  }

  ifShippingCountryInactive(shippingCountry: TShippingCountry): [boolean, TCode] {
    if (!shippingCountry.deletedAt)
      return [false, SHIPPING_COUNTRY_ERROR_CODES.ERROR_SHIPPING_COUNTRY_004]
    return [true, null]
  }

  ifShippingCountryForSeller(shippingCountry: TShippingCountry): [boolean, TCode] {
    if (!shippingCountry.toBeSeller)
      return [false, SHIPPING_COUNTRY_ERROR_CODES.ERROR_SHIPPING_COUNTRY_006]
    return [true, null]
  }

  async createOne(params: TShippingCountryCreate): Promise<[TShippingCountry, TCode]> {
    const [, code] = await this.ifShippingCountryNameNotExist(params.name)
    if (code) {
      return [null, code]
    }
    const data: Prisma.ShippingCountryUncheckedCreateInput = {
      ...params
    }
    const createdRecord = await this.prisma.shippingCountry.create({
      data
    })
    await this.redisService.clearGroup(CACHES.shippingCountry.group)
    return [createdRecord, null]
  }

  async findOne(
    shippingCountryId: number,
    select: TShippingCountrySelect = findShippingCountrySelect()
  ): Promise<[TShippingCountry, TCode]> {
    const key = `${CACHES.shippingCountry.group}:${CACHES.shippingCountry.getShippingCountryService}:${shippingCountryId}:${JSON.stringify(select)}`
    const cache = await this.redisService.getKey(key)
    this.redisService.addGroup(key, CACHES.shippingCountry.group)
    let foundRecord: TShippingCountry | null = null
    if (cache) {
      foundRecord = cache
    } else {
      foundRecord = await this.prisma.shippingCountry.findUnique({
        where: {
          id: shippingCountryId
        },
        select
      }) as TShippingCountry
      await this.redisService.setKey(key, JSON.stringify(foundRecord), redis.ttl)
    }

    if (!foundRecord) {
      return [null, SHIPPING_COUNTRY_ERROR_CODES.ERROR_SHIPPING_COUNTRY_001]
    }
    return [foundRecord, null]
  }

  async findMany(
    shippingCountryIds: number[],
    select: TShippingCountrySelect
  ): Promise<TShippingCountry[]> {
    const key = `${CACHES.shippingCountry.group}:${CACHES.shippingCountry.getShippingCountriesService}:${shippingCountryIds.join('|')}:${JSON.stringify(select)}`
    const cache = await this.redisService.getKey(key)
    this.redisService.addGroup(key, CACHES.shippingCountry.group)
    if (cache) return cache
    const foundRecords = await Promise.all(
      shippingCountryIds.map(shippingCountryId => this.findOne(shippingCountryId, select)))
    const results = foundRecords.map(([record]) => record).filter(record => !!record)
    await this.redisService.setKey(key, JSON.stringify(results), redis.ttl)
    return results
  }

  async updateOne(
    shippingCountryId: number,
    params: TShippingCountryUpdate
  ): Promise<[TShippingCountry, TCode]> {
    const [shippingCountry, code] = await this.findOne(shippingCountryId)
    if (code) return [null, code]
    const [, code2] = this.ifShippingCountryActive(shippingCountry)
    if (code2) return [null, code2]
    const [, code3] = await this.ifShippingCountryNameNotExist(params.name, shippingCountryId)
    if (code3) return [null, code3]
    const data: Prisma.ShippingCountryUncheckedUpdateInput = { ...params }
    const updatedRecord = await this.prisma.shippingCountry.update({
      where: {
        id: shippingCountryId
      },
      data
    })
    await this.redisService.clearGroup(CACHES.shippingCountry.group)
    return [updatedRecord, null]
  }

  async deactiveOne(shippingCountryId: number): Promise<[TShippingCountry, TCode]> {
    const [shippingCountry, code] = await this.findOne(shippingCountryId)
    if (code) return [null, code]
    const [, code2] = this.ifShippingCountryActive(shippingCountry)
    if (code2) return [null, code2]
    const updatedRecord = await this.prisma.shippingCountry.update({
      where: {
        id: shippingCountryId
      },
      data: {
        deletedAt: new Date()
      }
    })
    await this.redisService.clearGroup(CACHES.shippingCountry.group)
    return [updatedRecord, null]
  }

  async activateOne(shippingCountryId: number): Promise<[TShippingCountry, TCode]> {
    const [shippingCountry, code] = await this.findOne(shippingCountryId)
    if (code) return [null, code]
    const [, code2] = this.ifShippingCountryInactive(shippingCountry)
    if (code2) return [null, code2]
    const updatedRecord = await this.prisma.shippingCountry.update({
      where: {
        id: shippingCountryId
      },
      data: {
        deletedAt: null
      }
    })
    await this.redisService.clearGroup(CACHES.shippingCountry.group)
    return [updatedRecord, null]
  }
}
