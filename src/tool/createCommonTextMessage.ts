import { FlexComponent, FlexMessage } from '@line/bot-sdk'
import { createFlexMessage } from './createMessage'

type TextSize =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | '3xl'
  | '4xl'
  | '5xl'

export interface CommonTextMessageDataContent {
  key: string
  keyColor?: string
  keySize?: TextSize
  value: string
  valueColor?: string
  valueSize?: TextSize
}

export interface CommonTextMessageData {
  title: string
  titleSize?: TextSize
  subTitle?: string
  contents: (CommonTextMessageDataContent | 'separator')[]
}

export default function createCommonTextMessage(
  commonTextMessageData: CommonTextMessageData,
  altText: string
): FlexMessage {
  const titleComponent: FlexComponent[] = [
    {
      type: 'text',
      text: commonTextMessageData.title,
      size: commonTextMessageData.titleSize ?? 'xl',
      color: '#555555',
      flex: 0,
      weight: 'bold',
      wrap: true,
    },
  ]

  if (commonTextMessageData.subTitle)
    titleComponent.push({
      type: 'text',
      text: commonTextMessageData.subTitle,
      size: 'xl',
      color: '#111111',
      align: 'end',
    })

  return createFlexMessage(
    {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: titleComponent,
          },
          {
            type: 'separator',
            margin: 'xs',
          },
          ...commonTextMessageData.contents.map(
            (content): FlexComponent =>
              content === 'separator'
                ? {
                    type: 'separator',
                    margin: 'xs',
                  }
                : {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: content.key,
                        size: content.keySize ?? 'sm',
                        color: content.keyColor ?? '#555555',
                        flex: 0,
                      },
                      {
                        type: 'text',
                        text: content.value,
                        size: content.valueSize ?? 'sm',
                        color: content.valueColor ?? '#111111',
                        align: 'end',
                      },
                    ],
                  }
          ),
        ],
      },
    },
    altText
  )
}
