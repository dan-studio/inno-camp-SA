/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

function signup() {
  let username = $('#username').val()
  let id = $('#id').val()
  let pw = $('#pw').val()
  let cfpw = $('#cfpw').val()
  if (username == "") {
    alert('이름을 입력하세요')
  } else if (id == "") {
    alert('아이디를 입력하세요')
  } else if (pw == "") {
    alert('비밀번호를 입력하세요')
		return false;
  } else if (cfpw == "") {
    alert('비밀번호를 다시 한번 입력하세요')
		return false;
  } else if (cfpw !== pw) {
    alert('비밀번호가 일치하지 않습니다.')
    return false;
  }
  $.ajax({
    type: "POST",
    url: "/signup",
    data: {
      username_give: username,
      id_give: id,
      pw_give: pw,
    },
    success: function (response) {
      alert(response["result"])
      window.location.reload()
    }
  });
}

function checkid() {
  let id = $('#id').val()
  let button = document.getElementById('registerSubmit')
  if (id == "") {
    alert('아이디를 입력하세요')
  }
  $.ajax({
    type: "POST",
    url: '/signup/checkid',
    data: {
      id_give: id
    },
    success: function (response) {
      if (response['exists']) {
        alert('이미 존재하는 아이디입니다.')
      } else {
        alert('사용 가능한 아이디입니다.')
				document.getElementById('id').disabled=true
        button.disabled=false;
      }
    }
  })
}

function signin() {
  let id = $('#ID').val()
  let pw = $('#PW').val()

  if (id == '') {
    alert('아이디를 입력하세요')
    return false
  } else if (pw == '') {
    alert('비밀번호를 입력하세요')
    return false
  }
  $.ajax({
    type: "POST",
    url: "/signin",
    data: {
      id_give: id,
      pw_give: pw
    },
    success: function (response) {
      if (response['result'] == 'success') {
        $.cookie('mytoken', response['token'], {
          path: '/'
        })
        window.location.replace('/')
      } else {
        alert(response['msg'])
      }
    }
  })
}

function signout() {
  $.removeCookie('mytoken', {
    path: '/'
  });
  alert('로그아웃!')
  window.location.href = "/"
}
