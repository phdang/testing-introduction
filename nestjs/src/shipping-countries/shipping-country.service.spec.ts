import { Test } from "@nestjs/testing"
import { ShippingCountryService } from "./shipping-country.service"
import { PrismaModule } from "src/prisma/prisma.module"
import { RedisModule } from "src/redis/redis.module"
import { RedisService } from "src/redis/redis.service"
import { CACHES } from "src/redis/redis.key"
import { findShippingCountrySelect } from "./shipping-country.type"

describe('Shipping Country Service', () => {
  let service: ShippingCountryService
  let cache: RedisService
  beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PrismaModule, RedisModule],
    providers: [ShippingCountryService]
  }).compile()
  service = moduleRef.get<ShippingCountryService>(ShippingCountryService)
  cache = moduleRef.get<RedisService>(RedisService)
})
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should return true if shipping country name does not exist', async () => {
    const expected = [true, null]
    const result = await service.ifShippingCountryNameNotExist('Dang')
    expect(result).toEqual(expected)
  })
  it('should return false if the shipping country is exists', async () => {
    const expected = [false, { code: 'ERROR_SHIPPING_COUNTRY_002', message: 'SHIPPING COUNTRY NAME EXISTS' }]
    const result = await service.ifShippingCountryNameNotExist('Japan')
    expect(result).toEqual(expected)
  })
  it('should return the country with the country id and its cache in redis', async () => {
    const expectedCountry = {
      id: 3,
      name: 'Japan'
    }
    const select = findShippingCountrySelect()
    const [country] = await service.findOne(3, select)
    expect(country.id).toEqual(expectedCountry.id)
    expect(country.name).toEqual(expectedCountry.name)
    const key = `${CACHES.shippingCountry.group}:${CACHES.shippingCountry.getShippingCountryService}:${country.id}:${JSON.stringify(select)}`
    const redisCountry = await cache.getKey(key)
    expect(redisCountry).toEqual(country)
  })
})
