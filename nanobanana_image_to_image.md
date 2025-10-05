# /fal-ai/nano-banana/edit 图片编辑

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /fal-ai/nano-banana/edit:
    post:
      summary: /fal-ai/nano-banana/edit 图片编辑
      deprecated: false
      description: '官方文档: https://fal.ai/models/fal-ai/nano-banana/edit'
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
                  description: 图像编辑的提示词。
                image_urls:
                  type: array
                  items:
                    type: string
                  description: 需要编辑的图片url。
                num_images:
                  type: integer
                  description: 生成图片数量。范围值1-4。默认值：1
              required:
                - prompt
                - image_urls
              x-apifox-orders:
                - prompt
                - image_urls
                - num_images
            example:
              prompt: >-
                make a photo of the man driving the car down the california
                coastline
              image_urls:
                - >-
                  https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png
                - >-
                  https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input-2.png
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
                request_id: f8837f29-26cb-4213-90f5-22b2911a0ea7
                response_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7
                status_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7/status
                cancel_url: >-
                  https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7/cancel
                logs: null
                metrics: {}
                queue_position: 0
          headers: {}
          x-apifox-name: 成功
      security:
        - bearer: []
      x-apifox-folder: 绘画模型/Fal.ai平台
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5443236/apis/api-341952136-run
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