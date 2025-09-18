// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProposalFactory
 * @dev A contract for creating and managing governance proposals on Somnia Network
 * @author Governance Proposal Generator Team
 */
contract ProposalFactory {
    // Proposal status enumeration
    enum ProposalStatus {
        Created,
        Executed
    }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        bytes encodedAction;
        ProposalStatus status;
        uint256 createdAt;
    }
    
    // State variables
    uint256 private _proposalCounter;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public proposerProposals;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string description,
        bytes encodedAction
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed proposer
    );
    
    // Modifiers
    modifier onlyProposer(uint256 proposalId) {
        require(proposals[proposalId].proposer == msg.sender, "Only proposer can execute this action");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= _proposalCounter, "Proposal does not exist");
        _;
    }
    
    /**
     * @dev Creates a new governance proposal
     * @param title The title of the proposal
     * @param description The description of the proposal
     * @param encodedAction The encoded action data for the proposal
     * @return proposalId The ID of the created proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        bytes memory encodedAction
    ) external returns (uint256 proposalId) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(encodedAction.length > 0, "Encoded action cannot be empty");
        
        _proposalCounter++;
        proposalId = _proposalCounter;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            encodedAction: encodedAction,
            status: ProposalStatus.Created,
            createdAt: block.timestamp
        });
        
        proposerProposals[msg.sender].push(proposalId);
        
        emit ProposalCreated(proposalId, msg.sender, title, description, encodedAction);
        
        return proposalId;
    }
    
    /**
     * @dev Marks a proposal as executed (only proposer can do this)
     * @param proposalId The ID of the proposal to mark as executed
     */
    function markAsExecuted(uint256 proposalId) 
        external 
        proposalExists(proposalId) 
        onlyProposer(proposalId) 
    {
        require(proposals[proposalId].status == ProposalStatus.Created, "Proposal already executed");
        
        proposals[proposalId].status = ProposalStatus.Executed;
        
        emit ProposalExecuted(proposalId, msg.sender);
    }
    
    /**
     * @dev Gets proposal details by ID
     * @param proposalId The ID of the proposal
     * @return proposal The proposal struct
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (Proposal memory proposal) 
    {
        return proposals[proposalId];
    }
    
    /**
     * @dev Gets all proposal IDs created by a specific proposer
     * @param proposer The address of the proposer
     * @return proposalIds Array of proposal IDs
     */
    function getProposerProposals(address proposer) 
        external 
        view 
        returns (uint256[] memory proposalIds) 
    {
        return proposerProposals[proposer];
    }
    
    /**
     * @dev Gets the total number of proposals created
     * @return count The total proposal count
     */
    function getProposalCount() external view returns (uint256 count) {
        return _proposalCounter;
    }
    
    /**
     * @dev Gets multiple proposals by their IDs
     * @param proposalIds Array of proposal IDs to fetch
     * @return proposalList Array of proposals
     */
    function getMultipleProposals(uint256[] memory proposalIds) 
        external 
        view 
        returns (Proposal[] memory proposalList) 
    {
        proposalList = new Proposal[](proposalIds.length);
        
        for (uint256 i = 0; i < proposalIds.length; i++) {
            if (proposalIds[i] > 0 && proposalIds[i] <= _proposalCounter) {
                proposalList[i] = proposals[proposalIds[i]];
            }
        }
        
        return proposalList;
    }
}