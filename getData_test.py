import requests

data = {
    'userId':"o3vDU5SXBWMX3SnVVHeQb7RXhg2Y"
}
url = 'https://fc-mp-99639a91-d42d-4db8-8d13-0c04abc02738.next.bspapp.com/download'

res = requests.get(url,params=data)
print(res.text)