import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class CCValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged: ()=> void;

	private _creditCardText: HTMLInputElement;
	private _image: HTMLImageElement;
	private _value: string;
	private _numberOfRepo: number;
	private isVisa: boolean;
	private isMaster: boolean;
	private isDiscover: boolean;
	private _fullnameLabel: HTMLLabelElement;
	private _creditCardLabel: HTMLLabelElement;
	private _fullnameText : HTMLInputElement;
	private _cardElement : HTMLDivElement;

	private _textboxOnChange: EventListenerOrEventListenerObject;
	private _fullnameTextOnChange: EventListenerOrEventListenerObject;

	private masterCardPrefix = [50 , 51 , 52 , 53 , 54 , 55];

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{

		// Test

		var reg = ""

		///////////////

		// Add control initialization code

		// Instanciate NotifyOutputChanged mETHODE
		this._notifyOutputChanged = notifyOutputChanged;

		// Bind The TextBoxChange Method
		this._textboxOnChange = this.textboxOnChange.bind(this);
		this._fullnameTextOnChange = this.fullnameTextOnChange.bind(this);

		// Create Image Element
		let img = document.createElement('img');

		// Create TextBox And Add Placeholder And an EventListner
		let creditCardNumber = document.createElement('input');
		creditCardNumber.setAttribute("placeholder", "----");
		creditCardNumber.addEventListener('input' , this._textboxOnChange)

		// Create Variable To Display Repository Number
		/*let textboxNumberOfRepo = document.createElement('input');
		textboxNumberOfRepo.value = this._numberOfRepo.toString();*/

		// Create Username Variable That Get The gitusername Property From The Context
		let CreditCNumber = context.parameters.creditCardNumber.raw || "";

		// Create Shape Variable That Get ImageShape Property With The Two Value (Square Or Circle)
		let shape = context.parameters.imageShape.raw;

		// Pass The Username Value To Our TextBox
		creditCardNumber.value = CreditCNumber;

		this._creditCardText = creditCardNumber;



		//Test If The Type Of Shape iS Circle Or Square
		if(shape == "Circle") {
			img.classList.add("circle");
		}

		this._image = img;

		// Add To The Coontainer The Two Element (Image And TextBox)

		container.appendChild(creditCardNumber);
		container.appendChild(img);

		// Call SetAvatar Function 
		this.setAvatarImage(img)


		

		/**
		 * 	Create Credit Card
		 */

		// FullName TextBox
		let fullnameText = document.createElement('input');
		fullnameText.setAttribute("placeholder", "----");
		fullnameText.addEventListener('input' , this._fullnameTextOnChange)

		let fullnameInp = context.parameters.fullname.raw || "";

		fullnameText.value = fullnameInp;

		this._fullnameText = fullnameText;

		container.appendChild(fullnameText);


		// Create Card Div
		let card = document.createElement('div');
		card.classList.add('card');

		// Create Image Bg Div
		let imageDiv = document.createElement('div');
		imageDiv.classList.add('bg');
		card.appendChild(imageDiv)

		// Create Credit NUmber Label
		let creditCardLabel = document.createElement('label');
		creditCardLabel.classList.add('lblCreditNumber')
		this._creditCardLabel = creditCardLabel;
		card.appendChild(creditCardLabel);

		// Create FullName Label
		let fullname = document.createElement('label');
		fullname.classList.add('lblFullName');
		
		this._fullnameLabel = fullname;
		card.appendChild(fullname);

		// Add Image Logo To Card

		card.appendChild(img)

		

		// Add Label For Month And Year Expiration
		let monthYearExpLabel = document.createElement('label');
		monthYearExpLabel.innerText = "VALID THRU : 11 / 28";
		monthYearExpLabel.classList.add('monthYearExpLabel')
		card.appendChild(monthYearExpLabel);

		this._cardElement = card;
		container.appendChild(card);
		this._creditCardLabel.innerText = this.getCreditCardFormat() || "";
		this._fullnameLabel.innerText = this._fullnameText.value || "";

		

		// Start Image Init

		this.testCardState(creditCardNumber, this._cardElement, img);

		//card.classList.add(`${this.isMasterOrVisa}`);


	
	}

	private testCardState(creditCardNumber: HTMLInputElement, card: HTMLDivElement, img: HTMLImageElement) {
		if (creditCardNumber.value.startsWith('5')) {
			this.isMaster = true;
			card.classList.add('master');
		} else if (creditCardNumber.value.startsWith('4')) {
			this.isVisa = true;
			card.classList.add('visa');
		}

		this.setAvatarImage(img);
	}

	private isMasterOrVisa() {
		let myClass = "";
		if(this.isMaster) {
			myClass =  "master";
		}else 
		{
			myClass =  "visa";
		}
		return myClass;
	}

	private getCreditCardFormat() {
		var num = this._creditCardText.value;
		var result = "";
		var gap_size = 4;

		while (num.length > 0) {
			result = result + " " + num.substring(0, gap_size);
			num = num.substring(gap_size);
		}
		return result;
	}

	//==== Function _fullnameTextOnChange
	private fullnameTextOnChange(){
		console.log(this._fullnameText.value)
		this._fullnameLabel.innerText = this._fullnameText.value || "";
		this._notifyOutputChanged();

	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._creditCardText.disabled = context.mode.isControlDisabled;
		this._fullnameText.disabled = context.mode.isControlDisabled;
	}

	public getOutputs(): IOutputs
	{
		return {
			creditCardNumber: this._value,
			fullname: this._fullnameLabel.innerText
		};
	}

	
	public destroy(): void
	{
		this._creditCardText.removeEventListener('input', this._textboxOnChange);
		this._fullnameText.removeEventListener('input', this._fullnameTextOnChange);
	}

	private textboxOnChange(): void  {

		this._value = this._creditCardText.value || "";
		this._creditCardLabel.innerText = this.getCreditCardFormat() || "";


		const cardEnum = {
			VISA: 4,
			MASTER: 5,
			DISCOVER: 6
		}
		
		
		
		if(this._value.length == 0) {
			console.log("vide")
			this.isDiscover = false;
			this.isMaster = false;
			this.isVisa = false;
		}

		console.log(this._value.length)
		
		var numbers = /^[0-9]+$/;
		this._creditCardText.removeAttribute('onkeypress')
		if(this._value.length < 16) {
			switch (true) {
				case this._value.startsWith(cardEnum.VISA.toString()):
					this._cardElement.classList.add('visa')
					this._cardElement.classList.remove('master')
					this.isVisa = true;	
				break;
				case this._value.startsWith(cardEnum.MASTER.toString()):
					this._cardElement.classList.add('master')
					this._cardElement.classList.remove('visa')
					this.isMaster = true;	
					this.isVisa = false;	

				break;
				case this._value.startsWith(cardEnum.DISCOVER.toString()):
					console.log("discover Logo");
					this.isDiscover = true;	
					this.isMaster = false;	
					this.isVisa = false;	

				break;
			}
		}
		else {
			console.log("Rak Depasit")
			this._creditCardText.setAttribute('onkeypress','return false;');
		}


		this.setAvatarImage(this._image);
		this._notifyOutputChanged();
	}


	private async setAvatarImage(imageContainer: HTMLImageElement) {
		let _src = "";
		if(this.isVisa) {
			_src = "https://seeklogo.com/images/V/visa-logo-CF29426B98-seeklogo.com.png";
		} else if(this.isMaster) {
			_src = "https://seeklogo.com/images/M/mastercard-logo-38C4789CCA-seeklogo.com.png";
		} else if(this.isDiscover) {
			_src = "https://p.kindpng.com/picc/s/735-7354868_discover-credit-card-logo-png-discover-logo-transparent.png";
		}
		imageContainer.src = _src;
	}
	
}