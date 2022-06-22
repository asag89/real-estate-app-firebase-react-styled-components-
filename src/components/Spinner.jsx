
import styled from "styled-components"

const SpinnerContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5000;
    display: flex;
    justify-content: center;
    align-items: center;
`
const SpinnerWrapper = styled.div`

    width: 64px;
    height: 64px;
    border: 8px solid;
    border-color: #ad34eb transparent #ad34eb transparent;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`



const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper />
    </SpinnerContainer>
  )
}

export default Spinner