import datetime

x = datetime.datetime.now()
print(x)

with open("dataset.js", "w") as f:
  f.write(str(x))
