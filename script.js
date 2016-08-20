/* global document, console, interact */

class Draggable {
  constructor(dom) {
    this.dom = dom;
    this.setupDraggable();
  }

  setupDraggable() {
    interact(this.dom).draggable({
      inertia: true,
      /*snap: {
        targets: document.querySelectorAll('.card-slots'),
        endOnly: true
      },*/
      snap: {
        mode: 'anchor',
        anchors: [],
        range: Infinity,
        elementOrigin: { x: 0.5, y: 0.3 },
        //elementOrigin: { x: 0, y: 0 },
        endOnly: true
      },
      autoScroll: true,
      onmove: this.dragMoveListener
    });
  }

  dragMoveListener(event) {
    const target = event.target;

    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = `translate(${x}px, ${y}px)`;
    target.style.transform = target.style.webkitTransform;

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
}

class Dropzone {
  constructor(dom) {
    this.dom = dom;
    this.setupDropzone();
  }

  setupDropzone() {
    interact(this.dom).dropzone({ overlap: 0.51 })
      .on('dragenter', (event) => {
        const dropRectangle = interact.getElementRect(event.target);
        const dropCenter = {
          x: dropRectangle.left + (dropRectangle.width / 2),
          y: dropRectangle.top + (dropRectangle.height / 2)
        };

        // adds '.play' class to tile when tile is dropped on another element (board squares)
        //if (event.target.classList.contains('boardSquare')) {
        //event.relatedTarget.classList.add('dragging');
        //}

        event.draggable.snap({
          anchors: [dropCenter]
        });

        const card = event.relatedTarget;
        event.target.appendChild(card.parentNode.removeChild(card));
      })
      .on('dragleave', (event) => {
        event.draggable.snap(false);
        //event.relatedTarget.classList.remove('dragging');
      });
  }
}

class Card extends Draggable {}

class CardSlot extends Dropzone {}

document.addEventListener('DOMContentLoaded', () => {
  const cards = [];
  const cardSlots = [];

  [].forEach.call(document.querySelectorAll('.card'), (card) => {
    cards.push(new Card(card));
  });

  [].forEach.call(document.querySelectorAll('.card-slot'), (cardSlot) => {
    cardSlots.push(new CardSlot(cardSlot));
  });
});
