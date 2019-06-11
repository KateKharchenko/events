(function(){
	'use strict';

	loadJury();
	loadCompetitors();

	let timerInterval = setInterval(initTimer, 1000);

	function load(options) {

		let ajax = new XMLHttpRequest();
		ajax.responseType = 'json';
		ajax.open('GET', options.endpoint);

		ajax.send();

		ajax.onreadystatechange = function() {
			if (ajax.readyState != 4) return;

			if (ajax.status == 200) {
				let users = ajax.response.data;
				let html  = document.getElementById(options.target).innerHTML;
				for (var i = 0; i < users.length; i++) {
					html += options.template(users[i]);
				}
				document.getElementById(options.target).innerHTML = html;
				console.log(options.target);
				if (options.target == 'competitor_list') {
					loadCompetitors();
				}
			} else {
				document.getElementById(options.target).closest('section').hidden = true;
			}
		}
	}

	function loadJury() {

		load({
			endpoint: 'https://reqres.in/api/users?page=1',
			template: templateJury,
			target: 'persons'
		});

	}

	function templateJury(user) {
		return `<li class="person person--jury">
					<div class="person__img-wrap person__img-wrap--round">
						<img src="${user.avatar}" alt="${user.first_name} ${user.last_name}" class="person__image">
					</div>
					<h5 class="person__name">${user.first_name} ${user.last_name}</h5>
					<p class="person__text">${user.email}</p>
				</li>`;
	}

	function loadCompetitors() {

		let competitors = document.querySelectorAll('#competitor_list li').length, 
			page = competitors == 0 ? 2 : 3;

		if (competitors < 6) {
			load({
				endpoint: 'https://reqres.in/api/users?page=' + page,
				template: templateCompetitor,
				target: 'competitor_list'
			});
		}
	}

	function templateCompetitor(user) {
		return `<li class="person">
					<div class="person__img-wrap">
						<img src="${user.avatar}" alt="${user.first_name} ${user.last_name}" class="person__image">
					</div>
					<h5 class="person__name">${user.first_name} ${user.last_name}</h5>
					<p class="person__text">${user.email}</p>
				</li>`
	}

	function initTimer() {
		let toDate = new Date(2019, 6, 7, 18, 30),
			now    = new Date(),
			diff   = toDate - now;

		if (diff < 0) {
			clearInterval(timerInterval);
			return;
		}

		let days = Math.floor(diff / 1000 / 60 / 60 / 24);
		diff = diff - days * 1000 * 60 * 60 * 24;
		document.getElementById('days').innerText = days;

		let hours = Math.floor(diff / 1000 / 60 / 60);
		hours = (hours.toString().length == 1) ? '0' + hours : hours;
		diff = diff - hours * 1000 * 60 * 60;
		document.getElementById('hours').innerText = hours;

		let min = Math.floor(diff / 1000 / 60);
		min = (min.toString().length == 1) ? '0' + min : min;
		diff = diff - min * 1000 * 60;
		document.getElementById('minutes').innerText = min;

		let sec = Math.round(diff / 1000);
		sec = (sec.toString().length == 1) ? '0' + sec : sec;
		diff = diff - sec * 1000;
		document.getElementById('seconds').innerText = sec;
	}

})();