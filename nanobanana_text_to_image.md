# /fal-ai/nano-banana 文生图

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /fal-ai/nano-banana:
    post:
      summary: /fal-ai/nano-banana 文生图
      deprecated: false
      description: '官方文档: https://fal.ai/models/fal-ai/nano-banana'
      tags:
        - 绘画模型/Fal.ai平台
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                  description: 生成图片的提示词。
                num_images:
                  type: integer
                  description: 生成图片数量。范围值1-4。默认值：1
              required:
                - prompt
              x-apifox-orders:
                - prompt
                - num_images
            example:
              prompt: >-
                An action shot of a black lab swimming in an inground suburban
                swimming pool. The camera is placed meticulously on the water
                line, dividing the image in half, revealing both the dogs head
                above water holding a tennis ball in it's mouth, and it's paws
                paddling underwater.
              num_images: 1
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  request_id:
                    type: string
                  response_url:
                    type: string
                  status_url:
                    type: string
                  cancel_url:
                    type: string
                  logs:
                    type: 'null'
                  metrics:
                    type: object
                    properties: {}
                  queue_position:
                    type: integer
                required:
                  - status
                  - request_id
                  - response_url
                  - status_url
                  - cancel_url
                  - logs
                  - metrics
                  - queue_position
              example:
                status: IN_QUEUE
                request_id: e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca
                response_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca
                status_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca/status
                cancel_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca/cancel
                logs: null
                metrics: {}
                queue_position: 0
          headers: {}
          x-apifox-name: 成功
      security:
        - bearer: []
      x-apifox-folder: 绘画模型/Fal.ai平台
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5443236/apis/api-341948426-run
components:
  schemas: {}
  securitySchemes:
    bearer:
      type: http
      scheme: bearer
servers:
  - url: https://yunwu.ai
    description: 正式环境
security:
  - bearer: []

```