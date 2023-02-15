/** ----------------------- IMPORTS ----------------------- */
import { Container, Nav } from 'react-bootstrap';
/** ------------------------------------------------------- */


/**
 * Main function for Dashboard that returns all elements to be shown on Dashboard
 * 
 * @returns Dashboard Layout
 */
export default function Dashboard() {

    // Return Dashboard elements to be displayed
    return (
        <Container fluid>
            <Nav className="navbar fixed-top">
                <div className="container-fluid p-4 justify-content-center">
                    DASHBOARD
                </div>
            </Nav>
        </Container>
    )
}
