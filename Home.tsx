import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = () => {
	const [height, setHeight] = useState('')
	const [weight, setWeight] = useState('')
	const [BMI, setBMI] = useState(0.0)
	const isDisabled = height.length === 0 || weight.length === 0

	useEffect(() => {
		getData()
	}, [])
	const storeData = async () => {
		try {
			await AsyncStorage.setItem('height', height)
			await AsyncStorage.setItem('weight', weight)
			const jsonBMI = JSON.stringify(BMI)
			await AsyncStorage.setItem('jsonBMI', jsonBMI)
		} catch (e: any) {
			console.log(e)
		}
	}

	const getData = async () => {
		try {
			const height = await AsyncStorage.getItem('height')
			const weight = await AsyncStorage.getItem('weight')
			const jsonBMI = await AsyncStorage.getItem('jsonBMI')
			if (height && weight && jsonBMI) {
				setHeight(height)
				setWeight(weight)
				setBMI(Number(JSON.parse(jsonBMI)))
			}
		} catch (e: any) {
			console.log(e)
		}
	}

	React.useEffect(() => {}, [])
	const handlerCalcBMI = () => {
		const currentWeight = parseInt(weight)
		const currentHeight = parseInt(height)
		if (isNaN(currentHeight) || isNaN(currentWeight)) {
			return
		}

		const heightMetrs = currentHeight / 100
		setBMI(Number((currentWeight / (heightMetrs * heightMetrs)).toFixed(1)))
		storeData()
	}

	const filterDigits = (input: string): string => {
		return input.replace(/\D/g, '')
	}
	return (
		<ScrollView
			style={{ minHeight: '100%', backgroundColor: 'rgba(50, 50, 50, 1)' }}>
			<View style={styles.container}>
				<Text style={styles.titleText}>BMI Calculator</Text>
				<View style={styles.inputContainer}>
					<TextInput
						value={height}
						onChangeText={(value) => {
							setHeight(filterDigits(value))
						}}
						style={styles.input}
						placeholder='HEIGHT - SM'
						placeholderTextColor={'rgba(90, 90, 90, 1)'}
						keyboardType='number-pad'
					/>
					<TextInput
						value={weight}
						onChangeText={(value) => {
							setWeight(filterDigits(value))
						}}
						style={styles.input}
						placeholder='WEIGHT - KG'
						placeholderTextColor={'rgba(90, 90, 90, 1)'}
						keyboardType='number-pad'
					/>
				</View>

				<TouchableOpacity
					disabled={isDisabled}
					style={[styles.goButton, isDisabled && { opacity: 0.5 }]}
					onPress={() => {
						handlerCalcBMI()
					}}>
					<Text style={styles.goButtonText}>Go</Text>
				</TouchableOpacity>

				<Text style={styles.BMIText}>{BMI}</Text>

				<View style={styles.line}></View>

				<View style={styles.boxes}>
					<View
						style={[
							styles.rectangle1,
							BMI <= 18.5 && BMI >= 0.1 && { opacity: 1 },
						]}>
						<Image
							style={styles.YellowImage}
							source={require('./assets/yellow.png')}
						/>
						<Text style={styles.valueText}>Under 18.5</Text>
						<Text style={styles.noteText}>Under Weight</Text>
					</View>
					<View
						style={[
							styles.rectangle2,
							BMI > 18.5 && BMI < 25.5 && { opacity: 1 },
						]}>
						<Image
							style={styles.GreenImage}
							source={require('./assets/green.png')}
						/>
						<Text style={styles.valueText1}>18.6-25</Text>
						<Text style={styles.noteText1}>Normal Weight</Text>
					</View>
					<View style={[styles.rectangle3, BMI >= 25.5 && { opacity: 1 }]}>
						<Image
							style={styles.RedImage}
							source={require('./assets/red.png')}
						/>
						<Text style={styles.valueText2}>Above 25</Text>
						<Text style={styles.noteText2}>Ower Weight</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(50, 50, 50, 1)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		color: 'rgba(180, 170, 45, 1)',
		fontSize: 25,
		marginTop: 40,
	},

	inputContainer: {
		flexDirection: 'row',
		gap: 50,
		marginTop: 60,
	},

	input: {
		borderWidth: 1,
		borderRadius: 5,
		height: 50,
		width: 130,
		borderColor: 'black',
		padding: 10,
		color: 'white',
	},

	goButton: {
		backgroundColor: '#fff',
		paddingHorizontal: 30,
		paddingVertical: 7,

		borderRadius: 5,

		marginTop: 30,
	},

	goButtonText: {
		fontWeight: '500',
		fontSize: 16,
	},

	BMIText: {
		color: 'rgba(180, 170, 45, 1)',
		fontSize: 35,
		marginTop: 40,
	},

	rectangle1: {
		backgroundColor: 'yellow',
		borderWidth: 1,
		borderRadius: 3,
		height: 250,
		width: 100,
		alignItems: 'center',
		opacity: 0.3,
	},
	rectangle2: {
		backgroundColor: 'green',
		borderWidth: 1,
		borderRadius: 3,
		height: 250,
		width: 100,
		alignItems: 'center',
		opacity: 0.3,
	},
	rectangle3: {
		backgroundColor: 'red',
		borderWidth: 1,
		borderRadius: 3,
		height: 250,
		width: 100,
		alignItems: 'center',
		opacity: 0.3,
	},
	boxes: {
		flexDirection: 'row',
		gap: 30,
		marginTop: 30,
	},
	line: {
		width: '100%',
		backgroundColor: 'white',
		height: 1,
		opacity: 0.6,
		marginTop: 100,
	},
	YellowImage: {
		width: 115,
		height: 80,
		marginTop: 40,
	},
	valueText: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: 30,
	},
	noteText: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: 30,
	},
	GreenImage: {
		width: 90,
		height: 80,
		marginTop: 40,
	},
	RedImage: {
		width: 115,
		height: 100,
		marginTop: 25,
	},
	valueText1: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: 30,
	},
	noteText1: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: 30,
	},
	valueText2: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: 25,
	},
	noteText2: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: 30,
	},
})
