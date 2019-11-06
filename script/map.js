AFRAME.registerComponent('map-display', {
    schema: {
        title: { default: '' },
        artist: { default: '' },
    },
    init: function () {
        // Limit title to 20 characters
        const displayTitle = this.data.title.length > 20 ? `${this.data.title.substring(0, 17)}...` : this.data.title
        const text = displayTitle + '\n' + this.data.artist
        const textData = {
            align: 'left',
            width: 0.7,
            wrapCount: 22,
            value: text,
            color: 'white',
        }

        this.el.setAttribute('text', textData)

        // Instantiate a second text object behind the first to achieve an shadow effect
        const textShadowEl = document.createElement('a-entity')
        textData.color = 'black'
        textShadowEl.setAttribute('text', textData)
        textShadowEl.object3D.position.z = -0.01
        this.el.appendChild(textShadowEl)
    }
})

AFRAME.registerComponent('hello-world', {
    init: function () {
        console.log('Hello, World!');

        const worksphere = document.createElement('a-entity')
        worksphere.setAttribute('scale', '0.95 0.95 0.95')
        worksphere.setAttribute('color', 'red')
        this.el.appendChild(frameEl)
    }
});