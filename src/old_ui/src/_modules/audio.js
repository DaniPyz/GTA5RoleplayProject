import {Howl, Howler} from 'howler';

const audio = {
    sounds: [],

    play: (url, data = {}) =>
    {
        const id = audio.sounds.length
        const _url = []

        if(typeof url !== 'object') _url.push(url.indexOf('http') === -1 && url.indexOf('https') === -1 ? require(`../_audios/${url}`) : url)
        else url.forEach(item => _url.push(item.indexOf('http') === -1 && item.indexOf('https') === -1 ? require(`../_audios/${item}`) : item))

        const sound = new Howl({
          src: _url,
          volume: data.volume || 1,
          onend: () => {
            audio.sounds.slice(id, 1)
          }
        })
        sound.play()

        audio.sounds.push(sound)
        return id
    },
    stop: id =>
    {
        if(id < 0 || id >= audio.sounds.length)return

        const sound = audio.sounds[id]
        sound.stop()

        audio.sounds.slice(id, 1)
    }
}

export default audio
