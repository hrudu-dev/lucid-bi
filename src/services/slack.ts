interface SlackMessage {
  channel: string
  text: string
  attachments?: any[]
  blocks?: any[]
}

interface SlackConfig {
  botToken: string
  channelId: string
}

export class SlackService {
  private config: SlackConfig

  constructor(config: SlackConfig) {
    this.config = config
  }

  async sendMessage(message: SlackMessage): Promise<boolean> {
    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: message.channel || this.config.channelId,
          text: message.text,
          attachments: message.attachments,
          blocks: message.blocks,
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error('Slack message failed:', error)
      return false
    }
  }

  async sendInsightReport(insight: any): Promise<boolean> {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🧠 New AI Insight Generated',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Title:*\n${insight.title}`,
          },
          {
            type: 'mrkdwn',
            text: `*Confidence:*\n${Math.round(insight.confidenceScore * 100)}%`,
          },
        ],
      },
    ]

    if (insight.insights.insights && Array.isArray(insight.insights.insights)) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Key Insights:*\n${insight.insights.insights.slice(0, 3).map((item: string) => `• ${item}`).join('\n')}`,
        },
      })
    }

    if (insight.insights.recommendations && Array.isArray(insight.insights.recommendations)) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Recommendations:*\n${insight.insights.recommendations.slice(0, 3).map((item: string) => `• ${item}`).join('\n')}`,
        },
      })
    }

    return this.sendMessage({
      channel: this.config.channelId,
      text: 'New AI Insight Generated',
      blocks,
    })
  }

  async sendDataAlert(alert: { title: string; message: string; severity: 'info' | 'warning' | 'error' }): Promise<boolean> {
    const color = alert.severity === 'error' ? '#FF0000' : alert.severity === 'warning' ? '#FFA500' : '#00FF00'
    const emoji = alert.severity === 'error' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'

    return this.sendMessage({
      channel: this.config.channelId,
      text: `${emoji} ${alert.title}`,
      attachments: [
        {
          color,
          fields: [
            {
              title: alert.title,
              value: alert.message,
              short: false,
            },
          ],
          footer: 'LucidBI Alert System',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    })
  }
}

export const slackService = new SlackService({
  botToken: process.env.SLACK_BOT_TOKEN || '',
  channelId: process.env.SLACK_CHANNEL_ID || '',
})