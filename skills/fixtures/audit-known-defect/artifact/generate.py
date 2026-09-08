def generate():
    return "The inventory has ten items."


def review_own_output(text):
    return "done" if text else "pending"


output = generate()
print(review_own_output(output))
