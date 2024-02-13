import 'reflect-metadata';
import { Get, HttpRoute, Post, buildRoutes, httpRoutes } from './routing';
import { Router } from 'express';
import { container } from 'tsyringe';

describe('Get and Post decorators', () => {
  beforeEach(() => {
    httpRoutes.length = 0;
  });

  it('should add a route with method "get" to httpRoutes', () => {
    class TestController {
      @Get('/test')
      get(req: any, res: any) {
        res.send('GET request successful');
      }
    }

    expect(httpRoutes).toContainEqual({
      path: '/test',
      handler: 'get',
      method: 'get',
      controller: 'TestController',
    });
  });

  it('should add a route with method "post" to httpRoutes', () => {
    class TestController {
      @Post('/test')
      post(req: any, res: any) {
        res.send('POST request successful');
      }
    }

    expect(httpRoutes).toContainEqual({
      path: '/test',
      handler: 'post',
      method: 'post',
      controller: 'TestController',
    });
  });
});

describe('buildRoutes', () => {
  it('should build express router with routes from httpRoutes', () => {
    class TestController {
      @Get('/test')
      get(_req: any, res: any) {
        res.send('GET request successful');
      }

      @Post('/test')
      post(_req: any, res: any) {
        res.send('POST request successful');
      }
    }

    container.register('TestController', { useClass: TestController });

    const router = buildRoutes(httpRoutes);

    const getRequest = router.stack.filter(
      (layer) => layer.route?.methods.get && layer.route?.path === '/test'
    );
    const postRequest = router.stack.filter(
      (layer) => layer.route?.methods.post && layer.route?.path === '/test'
    );

    expect(getRequest).toBeTruthy();
    expect(postRequest).toBeTruthy();
  });
});
