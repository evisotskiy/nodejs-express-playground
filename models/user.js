const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    avatarUrl: String,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    },
    resetToken: String,
    resetTokenExp: Date
})

userSchema.methods.addToCart = function(course) {
    const items = [ ...this.cart.items ]
    const idx = items.findIndex(({ courseId }) => courseId.toString() === course._id.toString())

    if (~idx) {
        items[idx].count++
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    const items = [...this.cart.items];
    const idx = items.findIndex(({ courseId }) => courseId.toString() === id.toString())

    if (items[idx].count === 1) {
        items.splice(idx, 1);
    } else {
        items[idx].count--
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema);