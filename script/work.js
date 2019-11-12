AFRAME.registerComponent('show-caption', {
    schema: {
        num: {
            type: 'int'
        },
        title: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        caption: {
            type: 'string'
        },
    },
    init: function () {
        const contents = document.getElementById('contents')
        const container = document.getElementById('container')
        const tapTarget = this.el

        let pageContent = `<h2>${this.data.name}</h2><h3>${this.data.belongs}</h3><p class="outer">${this.data.caption}</p>`

        tapTarget.addEventListener('click', e => {
            contents.innerHTML = pageContent
            container.classList.remove('collapsed')
        })

    }
})