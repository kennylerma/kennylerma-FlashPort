
import { Sprite } from "@flashport/flashport";

/**
 * ...
 * @author Kenny Lerma
 */
export class Sample extends Sprite
{
	private _poster:string;
	private _url:string;
	private _frameWidth:number;
	private _frameHeight:number;
	private _target:string;
	
	public get poster():string { return this._poster; }
	public get url():string { return this._url; }
	public get target():string { return this._target; }
	public get frameWidth():number { return this._frameWidth; }
	public get frameHeight():number { return this._frameHeight; }
	
	constructor(poster:string, url:string, target:string, frameWidth:number, frameHeight:number) 
	{
		super();
		this._poster = poster;
		this._url = url;
		this._frameWidth = frameWidth;
		this._frameHeight = frameHeight;
		this._target = target;
	}
	
}