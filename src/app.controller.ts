// app.controller.ts - Enhanced Debug Controller
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cache-debug')
  async cacheDebug() {
    try {
      console.log('🔍 Cache Manager Debug Info:');
      console.log('Cache Manager:', !!this.cacheManager);
      console.log('Cache Stores:', this.cacheManager.stores);
      console.log('Stores Length:', this.cacheManager.stores?.length);

      // Get the first store (primary store)
      const primaryStore = this.cacheManager.stores?.[0] as any;
      console.log('Primary Store:', !!primaryStore);
      console.log('Store Type:', typeof primaryStore);
      console.log('Store Constructor:', primaryStore?.constructor?.name);

      // Check if it has Redis client
      console.log('Store Client:', !!primaryStore?.client);
      console.log('Store Name:', primaryStore?.name);

      // Try to access store properties
      let storeInfo = {};
      if (primaryStore) {
        storeInfo = {
          hasClient: !!primaryStore.client,
          storeName: primaryStore.name || 'unknown',
          storeType: typeof primaryStore,
          storeConstructor: primaryStore.constructor?.name || 'unknown',
          storeKeys: Object.keys(primaryStore).filter(
            (key) => !key.startsWith('_'),
          ),
        };
      }

      return {
        hasCacheManager: !!this.cacheManager,
        storesCount: this.cacheManager.stores?.length || 0,
        primaryStoreInfo: storeInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Debug error:', error);
      return { error: error.message, stack: error.stack };
    }
  }

  @Get('cache-test')
  async cacheTest(@Query('key') key?: string) {
    const cacheKey = key || 'manual_test';

    try {
      console.log(`🔍 Testing cache with key: ${cacheKey}`);

      // Get current cache data
      const startTime = Date.now();
      const cacheData = await this.cacheManager.get(cacheKey);
      const getTime = Date.now() - startTime;

      console.log('📦 Cache GET operation took:', getTime, 'ms');
      console.log('📦 Cache data found:', !!cacheData);

      if (cacheData) {
        console.log('✅ Data found in cache');
        return {
          source: 'cache',
          data: cacheData,
          retrievalTime: getTime,
          timestamp: new Date().toISOString(),
          key: cacheKey,
        };
      }

      // Create new data to cache
      const newData = {
        message: 'Fresh data from server',
        generated_at: new Date().toISOString(),
        random_value: Math.random(),
        server_time: Date.now(),
      };

      // Set data in cache
      const setStartTime = Date.now();
      await this.cacheManager.set(cacheKey, newData, 60000); // 60 seconds
      const setTime = Date.now() - setStartTime;

      console.log('💾 Cache SET operation took:', setTime, 'ms');
      console.log('💾 Data stored in cache with key:', cacheKey);

      // Immediately try to retrieve it to verify it was stored
      const verifyData = await this.cacheManager.get(cacheKey);
      console.log(
        '🔍 Verification: Data retrieved immediately after set:',
        !!verifyData,
      );

      return {
        source: 'generated',
        data: newData,
        setTime: setTime,
        verificationSuccess: !!verifyData,
        timestamp: new Date().toISOString(),
        key: cacheKey,
      };
    } catch (error) {
      console.error('❌ Cache test failed:', error);
      return {
        error: 'Cache operation failed',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('cache-direct-redis')
  async cacheDirectRedis(@Query('key') key?: string) {
    const cacheKey = key || 'direct_redis_test';

    try {
      // Get the primary store
      const primaryStore = this.cacheManager.stores?.[0] as any;

      if (!primaryStore?.client) {
        return {
          error: 'No Redis client available',
          message: 'Cache manager is not using Redis store',
          storeInfo: {
            hasStore: !!primaryStore,
            storeType: typeof primaryStore,
            hasClient: !!primaryStore?.client,
          },
        };
      }

      console.log('🔍 Testing direct Redis operations...');

      // Direct Redis operations
      const testData = {
        message: 'Direct Redis test',
        timestamp: new Date().toISOString(),
        random: Math.random(),
      };

      // Set directly via Redis client
      await primaryStore.client.setEx(cacheKey, 60, JSON.stringify(testData));
      console.log('💾 Data set directly via Redis client');

      // Get directly via Redis client
      const directResult = await primaryStore.client.get(cacheKey);
      console.log('📦 Data retrieved directly from Redis:', !!directResult);

      // Get via cache manager
      const cacheResult = await this.cacheManager.get(cacheKey);
      console.log('📦 Data retrieved via cache manager:', !!cacheResult);

      return {
        directRedisResult: directResult ? JSON.parse(directResult) : null,
        cacheManagerResult: cacheResult,
        bothMatch: JSON.stringify(cacheResult) === directResult,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Direct Redis test failed:', error);
      return {
        error: 'Direct Redis test failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('cache-clear')
  async clearCache(@Query('key') key?: string) {
    try {
      if (key) {
        await this.cacheManager.del(key);
        console.log(`🗑️ Cleared cache for key: ${key}`);
        return { message: `Cache cleared for key: ${key}` };
      } else {
        // await this.cacheManager.reset();
        console.log('🗑️ Cleared all cache');
        return { message: 'All cache cleared' };
      }
    } catch (error) {
      console.error('❌ Cache clear failed:', error);
      return {
        error: 'Cache clear failed',
        message: error.message,
      };
    }
  }
}
