const dev_enviroment = {
  ROOT_API: 'http://127.0.0.1:3343/api/admin/',
};
const production_enviroment = {
  ROOT_API: 'https://crm.asw.edu.co/api/admin/',
};
const qa_enviroment = {
  ROOT_API: 'https://sandbox-crm.asw.edu.co/api/admin/',
};

let enviroment;

if(process.env.NODE_ENV === 'production'){
	enviroment = production_enviroment;	
}else if(process.env.NODE_ENV === 'qa'){
	enviroment = qa_enviroment;	
}else{
	enviroment = dev_enviroment;	
}

export default enviroment;