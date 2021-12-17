
export default function errorHandler(isError,msg) {
		 swal({
              title: "Error",
              text: msg,
              icon: "error",
            });
}
