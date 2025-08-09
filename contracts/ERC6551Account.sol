// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

/**
 * @title ERC6551Account
 * @dev Token Bound Account implementation for GIFTY Cards
 * @custom:security-contact ferreiracavazin@gmail.com
 */
contract ERC6551Account is IERC1271 {
    uint256 public constant state = 0;

    event TransactionExecuted(address indexed target, uint256 indexed value, bytes data);

    receive() external payable {}

    /**
     * @dev Executes a transaction if called by the token owner
     * @param target Target contract address
     * @param value ETH value to send
     * @param data Transaction data
     */
    function executeCall(
        address target,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(_isValidSigner(msg.sender), "Invalid signer");
        require(target != address(0), "Invalid target");

        emit TransactionExecuted(target, value, data);

        bool success;
        (success, result) = target.call{value: value}(data);
        
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    /**
     * @dev Returns the token contract, token ID, and chain ID for this account
     */
    function token()
        external
        view
        returns (
            uint256 chainId,
            address tokenContract,
            uint256 tokenId
        )
    {
        bytes memory footer = new bytes(0x60);

        assembly {
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }

        return abi.decode(footer, (uint256, address, uint256));
    }

    /**
     * @dev Returns the owner of the token that controls this account
     */
    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    /**
     * @dev Returns whether the account supports a given interface
     * @param interfaceId Interface identifier
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return (interfaceId == type(IERC1271).interfaceId ||
                interfaceId == 0x01ffc9a7); // ERC165
    }

    /**
     * @dev Validates a signature according to ERC-1271
     * @param hash Hash of the message
     * @param signature Signature to validate
     */
    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);
        
        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    /**
     * @dev Checks if the given signer is valid (token owner)
     * @param signer Address to check
     */
    function _isValidSigner(address signer) internal view returns (bool) {
        return signer == owner();
    }

    /**
     * @dev Returns the current nonce for this account
     */
    function nonce() external view returns (uint256) {
        return state;
    }

    /**
     * @dev Get the balance of a specific ERC20 token
     * @param token Token contract address
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @dev Get the ETH balance of this account
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Batch execute multiple calls
     * @param targets Array of target addresses
     * @param values Array of ETH values
     * @param datas Array of call data
     */
    function batchExecute(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external payable returns (bytes[] memory results) {
        require(_isValidSigner(msg.sender), "Invalid signer");
        require(
            targets.length == values.length && values.length == datas.length,
            "Array length mismatch"
        );

        results = new bytes[](targets.length);

        for (uint256 i = 0; i < targets.length; i++) {
            require(targets[i] != address(0), "Invalid target");
            
            emit TransactionExecuted(targets[i], values[i], datas[i]);

            bool success;
            (success, results[i]) = targets[i].call{value: values[i]}(datas[i]);
            
            if (!success) {
                assembly {
                    revert(add(results, add(32, mul(i, 32))), mload(add(results, mul(i, 32))))
                }
            }
        }
    }
}