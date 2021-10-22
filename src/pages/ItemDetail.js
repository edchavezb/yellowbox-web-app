import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import styles from "./ItemDetail.module.css"

function ItemDetail(props) {

	const params = useParams()
	const [spotifyToken, setToken] = useState('')
	const [searchData, setSearchData] = useState({})


	useEffect(() => {
		handleSearch(params.type, params.query)
	}, [params]);

	useEffect(() => console.log(searchData), [searchData]);

	const getData = (query) => {
		axios({
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			data: querystring.stringify({ grant_type: 'client_credentials' }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization:
					`Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
			}
		})
			.then(response => {
				setToken(response.data.access_token)
				axios({
					method: 'get',
					url: query,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Bearer ${spotifyToken}`
					}
				})
					.then(response => {
						console.log(response.data)
						setSearchData(response.data)
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => {
				console.log(error);
			});
	}

	const handleSearch = async (type, query) => {
		let queryString;
		switch (type) {
			case 'album':
				queryString = `https://api.spotify.com/v1/albums/${query}/tracks`
				break;
			case 'artist':
				queryString = `https://api.spotify.com/v1/artists/${query}/albums`
				break;
			case 'track':
				queryString = `https://api.spotify.com/v1/tracks/${query}`
				break;
			default:
				break;
		}
		getData(queryString)
	}

	return (
		<div className="main-div">
			<h1> Is this what you're looking for? </h1>
			
		</div>
	);
}

export default ItemDetail;