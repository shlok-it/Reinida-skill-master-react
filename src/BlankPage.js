import React, { useState } from 'react'
import { Link } from "react-router-dom";
const BlankPage = () => {
	return (
		<div className="authincation fix-wrapper">
			<div className="container">
				<div className="row justify-content-center h-100 align-items-center">
					<div className="col-md-6">
						<div className="error-page">
							<div className="error-inner text-center">
								<div class="dz-error" data-text="404">404</div>
								<h2 class="error-head mb-0"><i class="fa fa-exclamation-triangle text-warning me-2"></i>The page you were looking for is not found!</h2>
								<div className="mt-5">
									<Link to="/dashboard" className="btn btn-secondary">Go Home</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default BlankPage