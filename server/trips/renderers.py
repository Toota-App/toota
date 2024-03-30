from rest_framework import renderers
import json

class UserRenderer(renderers.JSONRenderer):
	def render(self, data, accepted_media_type=None, renderer_context=None):
		charset = 'utf-8'
		response = ' '

		if 'ErrorDetail' in str(data):
			response = json.dumps({'erros': data})
		else: 
			response = json.dumps({'data': data })
		return response