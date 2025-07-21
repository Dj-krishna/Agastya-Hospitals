import { Row, Col, InputGroup } from "react-bootstrap";
import { FaBell, FaSearch } from "react-icons/fa";

function SearchInput({ searchInput, setSearchInput }) {
  return (
    <Row className="top_header d-flex align-items-center justify-content-between shadow-sm bg-white mb-2">
      <Col xs={12} md={8} sm={6}></Col>
      <Col xs={12} md={4} sm={6}>
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <input
            type="text"
            placeholder="Search here..."
            className="form-control border-0"
            id="search-input"
            name="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>
      </Col>
    </Row>
  );
}

export default SearchInput;
