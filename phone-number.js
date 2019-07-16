function createPhoneNumberComponent(params) {
    const defaultErrorText = 'Неверный номер, попробуйте ещё раз'


    let root = document.createElement('div')
    if (typeof params.mask != 'string') {
        throw new ValueError('params.mask must be of string type')
    }
    for (let c of params.mask) {
        root.appendChild(maskCharToElement(c))
    }
    let errorMessage = document.createElement('div')
    errorMessage.textContent = params.errorText || defaultErrorText
    errorMessage.className = 'phone-number-error-message'
    root.appendChild(errorMessage)
    root.className = 'phone-number-component'
    
    
    function changeActiveIndex(input, offset) {
        let inputs = input.parentNode.getInputs()
        let newIndex = inputs.indexOf(input) + offset
        if (inputs[newIndex]) {
            inputs[newIndex].focus()
            return inputs[newIndex]
        } else {
            input.blur()
            return null
        }
    }
    
    function processKeydown(event) {
        event.preventDefault()
        
        if (event.key.length == 1 && !isNaN(parseInt(event.key))) {
            this.value = event.key
            this.parentNode.setErrorState(false)
            changeActiveIndex(this, 1)
            return
        }
        if (event.key == 'Backspace' || event.key == 'Delete') {
            if (!this.value && event.key == 'Backspace') {
                let newInput = changeActiveIndex(this, -1)
                if (!newInput) {
                    return
                }
                newInput.value = ''
            } else {
                this.value = ''
            }
            this.parentNode.setErrorState(false)
            return
        }
        if (event.key == 'ArrowLeft') {
            changeActiveIndex(this, -1)
            return
        }
        if (event.key == 'ArrowRight') {
            changeActiveIndex(this, 1)
            return
        }
    }
    
    function addInputListeners(input) {
        input.addEventListener('keydown', processKeydown)
        input.addEventListener('paste', (event) => event.preventDefault())
    }
    
    function maskCharToElement(c) {
        if (c == 'I') {
            let input = document.createElement('input')
            input.type = 'text'
            input.size = 1
            input.placeholder = '_'
            input.pattern = '\d'
            input.className = 'phone-number-box'
            addInputListeners(input)
            return input
        }
        if (c.match(/\d|X|\*/)) {
            let box = document.createElement('span')
            box.textContent = c == '*' ? '●' : c
            box.className = 'phone-number-box'
            return box
        }
        return document.createTextNode(c)
    }
    

    root.setErrorState = function(state=true) {
        this.classList[state ? 'add' : 'remove']('phone-number-error-state')
    }
    
    root.getInputs = function() {
        return Array.from(this.children)
            .filter(elem => elem.nodeName == 'INPUT')
    }
    
    root.getInputValue = function() {
        let value = ''
        for (let elem of this.getInputs()) {
            value += elem.value ? elem.value : '_'
        }
        return value
    }
    
    root.getFullValue = function() {
        let value = ''
        for (let elem of this.childNodes) {
            if (elem.nodeName == 'INPUT') {
                value += elem.value ? elem.value : '_'
            } else if (elem.className != 'phone-number-error-message') {
                let c = elem.textContent
                if (c == '●') {
                    c = '*'
                }
                value += c
            }
        }
        return value
    }
    
    root.clearValue = function() {
        for (let elem of this.getInputs()) {
            elem.value = ''
        }
    }

    return root
}
