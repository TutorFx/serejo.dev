export default class {
  private route
  private gtag

  constructor() {
    const { gtag } = useGtag()

    this.gtag = gtag
    this.route = useRoute()
  };

  viewPage() {
    this.gtag('event', 'screen_view', {
      screen_name: this.route.name,
    })
  }

  trackLeadGeneration() {
    this.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      page_location: this.route.path,
    })
  }

  trackDownload() {
    this.trackEngagement('download_button', 'Download')
  }

  trackSchedule() {
    this.trackEngagement('schedule', 'Schedule')
  }

  trackChatMessage(message: string) {
    this.gtag('event', 'chat_message', {
      event_category: 'engagement',
      page_location: this.route.path,
      event_label: message,
    })
  }

  trackError(error: string) {
    this.gtag('event', error, {
      event_category: 'error',
      page_location: this.route.path,
    })
  }

  private trackEngagement(action: string, label?: string) {
    this.gtag('event', action, {
      event_category: 'engagement',
      page_location: this.route.path,
      event_label: label,
    })
  }
}
