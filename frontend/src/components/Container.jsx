export default function Container(props){
    return(
        <>
            <div className="container_prop">
                <div className="img">
                    {props.image}
                </div>
                
                <div className="val">
                    {props.value}
                </div>
                
            </div>
        </>
    )
}