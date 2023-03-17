import React, { useState } from 'react';
import { Button, Form, Container, Header } from 'semantic-ui-react';
import axios from 'axios';
import './App.css';

import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
  
var mqtt = require("mqtt");
var options = {
	protocol: "ws",
	username: "xxxxxxxxx",
	password: "xxxxxxxx",
	keepalive: 20,
	// clientId uniquely identifies client
	// choose any string you wish
	clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  };
var client = mqtt.connect("wss://weakpainter988:ItsyBitsy1@weakpainter988.cloud.shiftr.io");
 
// client.subscribe("TA");
console.log("Client subscribed ");


function App() {

	const [results, setResults] = useState(null);

	const [bump, setBump] = useState(false);

	const range = 5;

	client.on('connect', function () {
		client.subscribe('TA', function (msg) {
		  if (msg) {


		  }

		})
	  })
	  
	  client.on('message', function (topic, message) {
		// message is Buffer
		console.log(message.toString())
		setBump(true);
		handleGet();
		//client.end()
	  })
	  const [relationship, setRelationship] = useState('');
	  const [influencing, setInfluencing] = useState('');
	  const [executing, setExecuting] = useState('');
	  const [strategic, setStrategic] = useState('');
  
	  const [submitted, setSubmitted] = useState(false);
	  const [received, setReceived] = useState(false);

	const handleGet = () => {
		if (received) return;
		axios
		.get(
			'https://sheet.best/api/sheets/ace63b4c-ce9b-4529-927f-39bbb7d97049'
		)
		.then((response) => {
			console.log(response);
			setResults(response.data && response.data[response.data.length - 1]);
			setReceived(true)
		});
	}


	const handleSubmit = (e) => {
		e.preventDefault();

		//relationship	influencing	executing	strategic

		setSubmitted(true);


		const objt = { relationship, influencing, executing, strategic };

		axios
			.post(
				'https://sheet.best/api/sheets/ace63b4c-ce9b-4529-927f-39bbb7d97049',
				objt
			)
			.then((response) => {
				console.log(response);
			});
	};


	return (
		<Container fluid classRelationship="container">
			<Header as="h2">360 Feedback!</Header>
			{ !bump ?
			<div>
				<p>Please rate your co-worker on the following aspects of their work:</p>
				<Form classRelationship="form">
					<Form.Field>
						<label>Relationship Building</label>
						<input
						type="number"
						min="1"
						max="5"
							placeholder="Enter your Relationship Building rating (1-5)"
							onChange={(e) => setRelationship(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Influencing</label>
						<input
						type="number"
						min="1"
						max="5"
							placeholder="Enter your Influencing rating (1-5)"
							onChange={(e) => setInfluencing(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Executing</label>
						<input
						type="number"
						min="1"
						max="5"
							placeholder="Enter your Executing rating (1-5)"
							onChange={(e) => setExecuting(e.target.value)}
						/>
					</Form.Field>
					<Form.Field>
						<label>Strategic</label>
						<input
							type="number"
							min="1"
							max="5"
							placeholder="Enter your Strategic Thinking rating (1-5)"
							onChange={(e) => setStrategic(e.target.value)}
						/>
					</Form.Field>

					<Button color="blue" type="submit" onClick={handleSubmit}>
						{submitted ? 'Submitted!' : 'Submit' }
					</Button>
				</Form>
			</div> : 
				<div>
					<p>Results:</p>
					
					{results && 
					<div>
					<p>Relationship Building: {results && results.relationship}</p>
					<p>Influencing: {results && results.influencing}</p>

					<p>Executing: {results && results.executing}</p>

					<p>Strategic Thinking: {results && results.strategic}</p>



					<RadarChart
						captions={
							{
								relationship: 'Relationship Building',
								influencing: 'Influencing',
								executing: 'Executing',
								strategic: 'Strategic',
							}
						}
						data={
							[{
								data: {
									relationship: results ? parseFloat(results.relationship)/ range : 0,
									influencing: results ? parseFloat(results.influencing)/ range : 0,
									executing: results ? parseFloat(results.executing) / range : 0,
									strategic: results ? parseFloat(results.strategic)/ range : 0,
								
								},
								meta: { color: 'blue' }
							}]
						}
						size={450}
					/>
					</div>}

				</div>
			}	
		</Container>
	);
}

export default App;
