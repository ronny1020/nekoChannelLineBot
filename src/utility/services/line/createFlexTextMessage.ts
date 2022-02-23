import {
  FlexBubble,
  FlexCarousel,
  FlexComponent,
  FlexIcon,
  FlexMessage,
} from '@line/bot-sdk'
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

export interface FlexTextMessageDataContent {
  key: string
  keyColor?: string
  keySize?: TextSize
  value: string
  valueColor?: string
  valueSize?: TextSize
  iconUrl?: string
}

export interface CommonTextMessageData {
  title: string
  titleSize?: TextSize
  titleIconUrl?: string
  subTitle?: string
  contents: (FlexTextMessageDataContent | 'separator')[]
}

function createTitleComponent({
  title,
  titleSize,
  titleIconUrl,
  subTitle,
}: Omit<CommonTextMessageData, 'contents'>) {
  const titleComponent: FlexComponent[] = [
    {
      type: 'text',
      text: title,
      size: titleSize ?? 'xl',
      color: '#555555',
      flex: 0,
      weight: 'bold',
      wrap: true,
    },
  ]

  if (subTitle)
    titleComponent.push({
      type: 'text',
      text: subTitle,
      size: 'xl',
      color: '#111111',
      align: 'end',
    })

  if (titleIconUrl) {
    const iconComponent: FlexIcon = {
      type: 'icon',
      size: '4xl',
      url: titleIconUrl,
      aspectRatio: '1:1',
      position: 'relative',
    }
    titleComponent.push(iconComponent)
  }

  return titleComponent
}

function createContentRow(
  content: FlexTextMessageDataContent | 'separator'
): FlexComponent {
  if (content === 'separator')
    return {
      type: 'separator',
      margin: 'xs',
    }

  const contentRow: FlexComponent[] = [
    {
      type: 'text',
      text: content.key || ' ',
      size: content.keySize ?? 'sm',
      color: content.keyColor ?? '#555555',
      flex: 0,
    },
    {
      type: 'text',
      text: content.value || ' ',
      size: content.valueSize ?? 'sm',
      color: content.valueColor ?? '#111111',
      align: 'end',
    },
  ]

  if (content.iconUrl) {
    contentRow.push({
      type: 'icon',
      size: '4xl',
      url: content.iconUrl,
      aspectRatio: '1:1',
      position: 'relative',
    })
  }

  return {
    type: 'box',
    layout: 'baseline',
    contents: contentRow,
  }
}

function createFlexTextMessageBubble({
  contents,
  ...titleData
}: CommonTextMessageData): FlexBubble {
  return {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          contents: createTitleComponent(titleData),
        },
        {
          type: 'separator',
          margin: 'xs',
        },
        ...contents.map(createContentRow),
      ],
    },
  }
}

export function createBubbleFlexTextMessage(
  commonTextMessageData: CommonTextMessageData,
  altText: string
): FlexMessage {
  return createFlexMessage(
    createFlexTextMessageBubble(commonTextMessageData),
    altText
  )
}

export function createCarouselFlexTextMessage(
  commonTextMessageDataList: CommonTextMessageData[],
  altText: string
) {
  const contents: FlexBubble[] = commonTextMessageDataList.map(
    (commonTextMessageData) =>
      createFlexTextMessageBubble(commonTextMessageData)
  )

  const flexContainer: FlexCarousel = { type: 'carousel', contents }

  return createFlexMessage(flexContainer, altText)
}
