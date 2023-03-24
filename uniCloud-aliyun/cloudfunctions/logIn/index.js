'use strict';
exports.main = async (event, context) => {
	const {
		code
	} = event;
	const appId = 'wxe7c9d387a0ff3a26';
	const appsecret = '71350bba547fd73c90fb5e38a34566b6';
	//通过uniCloud服务器向微信请求用户的openid
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`, {
			dataType: "json"
		}
	)
	const openId = res.data.openid;
	return openId;
};