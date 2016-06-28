import Clipboard from 'clipboard'

const duration = 2000
const copiedText = 'Copied!'
const classNames = {
  popUp: 'pop-up'
}

const createNotification = (string) => {
  const content = `${string}`
  const notification = new Notification(content)

  setTimeout(function() {
    notification.close()
  }, duration)
}

const showNotification = (string) => {
  if (Notification.persmission === 'granted') {
    createNotification(string)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        createNotification(string)
      }
    })
  }
}

const clipboard = new Clipboard('.copy-handler')

clipboard.on('success', (event) => {
  if (event) {
    const node = event.trigger
    const textNode = node.querySelector('.text')
    const prevText = textNode.textContent

    if (prevText !== copiedText) {
      textNode.classList.add(classNames.popUp)
      textNode.textContent = copiedText

      showNotification(event.text)

      setTimeout(() => {
        textNode.classList.remove(classNames.popUp)
        textNode.textContent = prevText
      }, duration)
    }
  }
})
